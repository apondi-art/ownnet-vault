// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DataVault
 * @author OwnNet Vault
 * @notice A secure data vault for storing encrypted file references on-chain
 * @dev Implements security best practices for user data management
 */
contract DataVault {
    
    /// @notice Maximum number of files per user to prevent gas issues
    uint256 public constant MAX_FILES_PER_USER = 1000;
    
    /// @notice Maximum length for IPFS hash
    uint256 public constant MAX_HASH_LENGTH = 100;
    
    /// @notice Maximum length for manifest CID
    uint256 public constant MAX_MANIFEST_LENGTH = 100;
    
    /// @notice Contract owner for emergency functions
    address public owner;
    
    /// @notice Whether contract is paused
    bool public paused;
    
    /// @param ipfsHash The IPFS CID of the encrypted file
    /// @param timestamp When the file was added
    /// @param exists Whether the file still exists
    struct FileRecord {
        string ipfsHash;
        uint64 timestamp;
        bool exists;
    }
    
    /// @param manifestCID The IPFS CID of the encrypted manifest
    /// @param lastUpdated When the manifest was last updated
    /// @param exists Whether the vault exists
    struct UserVault {
        string manifestCID;
        uint64 lastUpdated;
        bool exists;
    }
    
    /// @dev Maps user address to their file records
    mapping(address => FileRecord[]) private userFiles;
    
    /// @dev Maps user address to file ownership status
    mapping(address => mapping(bytes32 => bool)) private fileOwnership;
    
    /// @dev Maps user address to their vault data
    mapping(address => UserVault) private userVaults;
    
    /// @dev Maps user address to file count
    mapping(address => uint256) private fileCount;
    
    /// @notice Emitted when a file is added to a user's vault
    /// @param user The address of the user
    /// @param ipfsHash The IPFS CID of the file
    /// @param timestamp The block timestamp when added
    event FileAdded(address indexed user, string ipfsHash, uint256 timestamp);
    
    /// @notice Emitted when a file is deleted from a user's vault
    /// @param user The address of the user
    /// @param index The index of the deleted file
    event FileDeleted(address indexed user, uint256 index);
    
    /// @notice Emitted when a manifest is updated
    /// @param user The address of the user
    /// @param manifestCID The new manifest CID
    /// @param timestamp The block timestamp when updated
    event ManifestUpdated(address indexed user, string manifestCID, uint256 timestamp);
    
    /// @notice Emitted when ownership is verified
    /// @param user The address of the user
    /// @param ipfsHash The IPFS CID being verified
    /// @param result Whether the user owns the file
    event OwnershipVerified(address indexed user, string ipfsHash, bool result);
    
    /// @notice Emitted when a vault is created
    /// @param user The address of the user
    event VaultCreated(address indexed user);
    
    /// @notice Emitted when contract is paused/unpaused
    /// @param paused Whether the contract is paused
    event PauseStateChanged(bool paused);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        paused = false;
    }
    
    /// @notice Pauses the contract (only owner)
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit PauseStateChanged(_paused);
    }
    
    /// @notice Transfers ownership (only owner)
    function transferOwnership(address _newOwner) external onlyOwner validAddress(_newOwner) {
        owner = _newOwner;
    }
    
    /// @notice Updates the manifest CID for the caller's vault
    /// @param _manifestCID The IPFS CID of the encrypted manifest
    /// @dev Only the owner of the vault can update their manifest
    function updateManifest(string memory _manifestCID) 
        external 
        whenNotPaused 
    {
        require(bytes(_manifestCID).length > 0, "Manifest CID cannot be empty");
        require(bytes(_manifestCID).length <= MAX_MANIFEST_LENGTH, "Manifest CID too long");
        
        if (!userVaults[msg.sender].exists) {
            emit VaultCreated(msg.sender);
        }
        
        userVaults[msg.sender] = UserVault({
            manifestCID: _manifestCID,
            lastUpdated: uint64(block.timestamp),
            exists: true
        });
        
        emit ManifestUpdated(msg.sender, _manifestCID, block.timestamp);
    }
    
    /// @notice Gets the manifest CID for a user
    /// @param _user The address of the user
    /// @return manifestCID The manifest CID
    /// @return lastUpdated The timestamp of last update
    function getManifestCID(address _user) 
        external 
        view 
        validAddress(_user)
        returns (string memory, uint256) 
    {
        require(userVaults[_user].exists, "Vault not found");
        return (userVaults[_user].manifestCID, userVaults[_user].lastUpdated);
    }
    
    /// @notice Checks if a user has a vault
    /// @param _user The address of the user
    /// @return exists Whether the vault exists
    function hasVault(address _user) external view validAddress(_user) returns (bool) {
        return userVaults[_user].exists;
    }
    
    /// @notice Adds a file to the caller's vault
    /// @param _ipfsHash The IPFS CID of the encrypted file
    /// @dev Only the owner can add files to their vault
    function addFile(string memory _ipfsHash) 
        external 
        whenNotPaused 
    {
        require(bytes(_ipfsHash).length > 0, "Hash cannot be empty");
        require(bytes(_ipfsHash).length <= MAX_HASH_LENGTH, "Hash too long");
        require(fileCount[msg.sender] < MAX_FILES_PER_USER, "Max files limit reached");
        
        bytes32 hashKey = keccak256(bytes(_ipfsHash));
        require(!fileOwnership[msg.sender][hashKey], "File already registered");
        
        FileRecord memory newFile = FileRecord({
            ipfsHash: _ipfsHash,
            timestamp: uint64(block.timestamp),
            exists: true
        });
        
        userFiles[msg.sender].push(newFile);
        fileOwnership[msg.sender][hashKey] = true;
        fileCount[msg.sender]++;
        
        emit FileAdded(msg.sender, _ipfsHash, block.timestamp);
    }
    
    /// @notice Gets a paginated list of files for the caller
    /// @param _startIndex The starting index
    /// @param _limit The maximum number of files to return (max 50)
    /// @return files Array of file records
    /// @dev Use pagination to avoid gas limits
    function getUserFilesPaginated(uint256 _startIndex, uint256 _limit) 
        external 
        view 
        returns (FileRecord[] memory) 
    {
        require(_limit > 0 && _limit <= 50, "Limit must be between 1 and 50");
        
        uint256 totalFiles = userFiles[msg.sender].length;
        
        if (_startIndex >= totalFiles) {
            return new FileRecord[](0);
        }
        
        uint256 endIndex = _startIndex + _limit;
        if (endIndex > totalFiles) {
            endIndex = totalFiles;
        }
        
        uint256 resultLength = endIndex - _startIndex;
        FileRecord[] memory result = new FileRecord[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = userFiles[msg.sender][_startIndex + i];
        }
        
        return result;
    }
    
    /// @notice Gets all files for the caller (use with caution - may hit gas limits)
    /// @return files Array of all file records
    /// @dev Prefer getUserFilesPaginated for large datasets
    function getUserFiles() external view returns (FileRecord[] memory) {
        return userFiles[msg.sender];
    }
    
    /// @notice Gets the total number of files for the caller
    /// @return count The number of files
    function getFileCount() external view returns (uint256) {
        return fileCount[msg.sender];
    }
    
    /// @notice Deletes a file from the caller's vault
    /// @param _index The index of the file to delete
    function deleteFile(uint256 _index) 
        external 
        whenNotPaused 
    {
        require(_index < userFiles[msg.sender].length, "Index out of bounds");
        
        bytes32 hashKey = keccak256(bytes(userFiles[msg.sender][_index].ipfsHash));
        fileOwnership[msg.sender][hashKey] = false;
        fileCount[msg.sender]--;
        
        // Move last element to deleted position and pop
        uint256 lastIndex = userFiles[msg.sender].length - 1;
        if (_index != lastIndex) {
            userFiles[msg.sender][_index] = userFiles[msg.sender][lastIndex];
        }
        userFiles[msg.sender].pop();
        
        emit FileDeleted(msg.sender, _index);
    }
    
    /// @notice Verifies if the caller owns a specific file
    /// @param _ipfsHash The IPFS CID to verify
    /// @return owned Whether the caller owns the file
    function verifyOwnership(string memory _ipfsHash) 
        external 
        view 
        returns (bool) 
    {
        require(bytes(_ipfsHash).length > 0, "Hash cannot be empty");
        require(bytes(_ipfsHash).length <= MAX_HASH_LENGTH, "Hash too long");
        
        bytes32 hashKey = keccak256(bytes(_ipfsHash));
        return fileOwnership[msg.sender][hashKey];
    }
    
    /// @notice Gets file info for a specific hash
    /// @param _ipfsHash The IPFS CID to query
    /// @return timestamp When the file was added
    /// @return exists Whether the file exists
    function getFileInfo(string memory _ipfsHash) 
        external 
        view 
        returns (uint256, bool) 
    {
        require(bytes(_ipfsHash).length > 0, "Hash cannot be empty");
        require(bytes(_ipfsHash).length <= MAX_HASH_LENGTH, "Hash too long");
        
        FileRecord[] storage files = userFiles[msg.sender];
        
        for (uint256 i = 0; i < files.length; i++) {
            if (keccak256(bytes(files[i].ipfsHash)) == keccak256(bytes(_ipfsHash))) {
                return (files[i].timestamp, files[i].exists);
            }
        }
        
        return (0, false);
    }
}