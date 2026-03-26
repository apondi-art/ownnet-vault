// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DataVault {
    struct FileRecord {
        string ipfsHash;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(address => FileRecord[]) private userFiles;
    mapping(address => mapping(string => bool)) private fileOwnership;
    
    event FileAdded(address indexed user, string ipfsHash, uint256 timestamp);
    event FileDeleted(address indexed user, uint256 index);
    
    function addFile(string memory _ipfsHash) external {
        require(bytes(_ipfsHash).length > 0, "Hash cannot be empty");
        require(!fileOwnership[msg.sender][_ipfsHash], "File already registered");
        
        FileRecord memory newFile = FileRecord({
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            exists: true
        });
        
        userFiles[msg.sender].push(newFile);
        fileOwnership[msg.sender][_ipfsHash] = true;
        
        emit FileAdded(msg.sender, _ipfsHash, block.timestamp);
    }
    
    function getUserFiles() external view returns (FileRecord[] memory) {
        return userFiles[msg.sender];
    }
    
    function getFileCount() external view returns (uint256) {
        return userFiles[msg.sender].length;
    }
    
    function deleteFile(uint256 _index) external {
        require(_index < userFiles[msg.sender].length, "Index out of bounds");
        
        string memory hashToDelete = userFiles[msg.sender][_index].ipfsHash;
        fileOwnership[msg.sender][hashToDelete] = false;
        
        userFiles[msg.sender][_index] = userFiles[msg.sender][userFiles[msg.sender].length - 1];
        userFiles[msg.sender].pop();
        
        emit FileDeleted(msg.sender, _index);
    }
    
    function verifyOwnership(string memory _ipfsHash) external view returns (bool) {
        return fileOwnership[msg.sender][_ipfsHash];
    }
    
    function getFileInfo(string memory _ipfsHash) external view returns (uint256, bool) {
        FileRecord[] storage files = userFiles[msg.sender];
        
        for (uint256 i = 0; i < files.length; i++) {
            if (keccak256(bytes(files[i].ipfsHash)) == keccak256(bytes(_ipfsHash))) {
                return (files[i].timestamp, files[i].exists);
            }
        }
        
        return (0, false);
    }
}