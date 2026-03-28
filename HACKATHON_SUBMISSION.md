# ETHOnline Hackathon Submission Guide

## 📋 Overview

**Hackathon:** ETHOnline 2024  
**Track:** Infrastructure & Digital Rights  
**Project:** OwnNet Vault  
**Live URL:** https://ownnet-vault.vercel.app/  

---

## ✅ Pre-Submission Checklist

### Required Items

| Item | Status | Notes |
|------|--------|-------|
| Live Demo | ✅ Done | https://ownnet-vault.vercel.app/ |
| Demo Video | ❌ TODO | 3-minute walkthrough |
| GitHub Repository | ✅ Done | Already pushed |
| README | ✅ Done | Hackathon section included |
| Smart Contract | ✅ Deployed | On Sepolia testnet |

### Optional Items (Bonus)

| Item | Status | Notes |
|------|--------|-------|
| Architecture Diagram | ✅ Done | In README |
| User Guide | ✅ Done | In README |
| Smart Contract Tests | ⚠️ Basic | Could add more |

---

## 🎬 Demo Video Script

### Video Structure (3 minutes)

**[0:00 - 0:15] Introduction**
```
"Hi, I'm [Your Name] and this is OwnNet Vault - a privacy-first 
data vault where YOU own your data.
"
```

**[0:15 - 0:45] The Problem**
```
"Today, when you store files online, companies like Google, Dropbox, 
and Microsoft can read your data, sell it to advertisers, or lose it 
in breaches. You don't truly own anything.

Data breaches happen every day. Your personal files, photos, and 
documents are stored on servers you don't control.
"
```

**[0:45 - 1:15] The Solution**
```
"OwnNet Vault solves this with client-side encryption.

[Show landing page]

Before your files ever leave your device, they're encrypted with 
AES-256-GCM military-grade encryption. We can NEVER see your data.

The keys stay in YOUR browser. You own everything.
"
```

**[1:15 - 1:45] Demo: Setup**
```
[Click "Get Started"]

"Let me show you how it works.

First, you create a password - this generates your encryption keys 
locally. We never see this password.

[Enter password]

Next, write down your 12-word recovery phrase. This is important - 
it lets you access your vault from ANY device.

[Show recovery phrase screen]

That's it. Your vault is created. No email, no account, no tracking.
"
```

**[1:45 - 2:15] Demo: Upload**
```
[Upload a test file - maybe an image]

"Now let's upload a file.

[Drag and drop a file]

See that? 'Encrypting...' - your file is being encrypted in YOUR 
browser before it's sent anywhere.

[Show file in list]

Your file is now stored on IPFS - a decentralized network. Not on 
our servers, not on AWS, on IPFS where no one can censor it.
"
```

**[2:15 - 2:45] Demo: Cross-Device Sync**
```
[Show Dashboard]

"Here's the cool part - cross-device sync.

Your encrypted file list is stored on the Ethereum blockchain. 
When you log in from another device, you enter your recovery phrase 
and BOOM - all your files are there.

[Show sync status indicator]

This works because we auto-generate a wallet for you. No MetaMask needed.
"
```

**[2:45 - 3:00] Closing**
```
"OwnNet Vault - Your Data, Your Control.

Zero-knowledge encryption. No central server. True ownership.

Try it now at ownnet-vault.vercel.app

Thank you!
"
```

### Recording Tips

1. **Use Loom or OBS** for easy recording
2. **1080p resolution** minimum
3. **Clear audio** - use a decent microphone
4. **Show your face** for credibility (optional)
5. **Keep it under 3 minutes**
6. **Upload to YouTube** (unlisted) or Loom

---

## 📝 Submission Form Fields

### When you go to ETHOnline submission page:

#### 1. Project Name
```
OwnNet Vault
```

#### 2. Project Description (50-100 words)
```
OwnNet Vault is a privacy-first data vault with client-side AES-256-GCM 
encryption. Files are encrypted in the browser before being uploaded to 
IPFS. Users own their encryption keys - we never see user data. A 
blockchain-based manifest system enables cross-device sync without any 
central server. Perfect for storing sensitive documents, private keys, 
and personal files with true data ownership.

Key features:
- Zero-knowledge architecture (server never sees data or keys)
- IPFS decentralized storage (no central server)
- Blockchain cross-device sync
- No MetaMask required (auto-generated wallet)
- Works for non-Web3 users
```

#### 3. Track Selection
```
☑ Infrastructure & Digital Rights
```

#### 4. Live Demo URL
```
https://ownnet-vault.vercel.app/
```

#### 5. Video URL
```
[Your YouTube/Loom video link]
```

#### 6. GitHub Repository
```
https://github.com/apondi-art/ownnet-vault
```

#### 7. Team Members
```
[Your Name] - [Your Email] - [Your Role]
```

#### 8. Sponsor Challenges (if applicable)
```
☑ IPFS/Pinata Challenge (if they have one)
☑ Ethereum Foundation Challenge (if applicable)
```

#### 9. Additional Notes (Optional)
```
Built with: React, Vite, Web Crypto API, IPFS/Pinata, Ethereum Smart Contract (Solidity 0.8.24)

No backend server required - fully decentralized architecture.

Security: All encryption happens client-side. Password-derived keys use PBKDF2 with 150,000 iterations.
```

---

## 🏆 Judge Alignment Notes

### How This Project Fits the Track

**Infrastructure & Digital Rights asks for:**

| Requirement | Our Implementation |
|-------------|-------------------|
| Decentralised cloud networks | ✅ IPFS storage, blockchain sync |
| Data ownership | ✅ User owns all keys, truly owns data |
| Privacy-preserving technologies | ✅ AES-256-GCM client-side encryption |
| Censorship-resistant communication | ✅ No central server, can't be censored |

### Matches Example Project Ideas

The hackathon description specifically mentions:
> *"Password managers with social recovery and no central server"*

**We have:** Recovery phrase for vault access, no central server ✅

> *"File storage apps with client-side encryption and token incentives"*

**We have:** Client-side AES-256-GCM encryption ✅

> *"Personal data vaults with granular consent and monetization controls"*

**We have:** User owns all data, controls all access ✅

---

## 📊 Judging Criteria & How We Meet Them

### 1. Innovation/Creativity (Score: X/10)

**Our Innovation:**
- Auto-generated wallet (no MetaMask setup)
- Zero-knowledge cross-device sync
- Encrypted manifest on blockchain
- Works seamlessly for non-crypto users

### 2. Impact/Usefulness (Score: X/10)

**Real Problem Solved:**
- Data breaches affect millions
- Users don't own their files
- Companies sell personal data
- Censorship removes content

**Our Solution:**
- True data ownership
- Privacy by default
- Censorship-resistant
- No account required

### 3. Relevance to Theme (Score: X/10)

**Perfect Alignment:**
| Theme Element | Our Implementation |
|---------------|-------------------|
| Decentralised infrastructure | ✅ IPFS + Ethereum |
| Data ownership | ✅ User owns keys |
| Privacy-preserving | ✅ Client-side encryption |
| Censorship resistance | ✅ No central server |

### 4. Use of Sponsor Tech (Score: X/10)

| Sponsor | How We Use It |
|---------|----------------|
| IPFS/Pinata | ✅ File storage, manifest storage |
| Ethereum | ✅ Smart contract for cross-device sync |

---

## ⏰ Submission Timeline

### Day 1
- [x] Project complete
- [x] Deployed to Vercel
- [x] README updated
- [x] GitHub pushed

### Day 2
- [ ] Record demo video (3 min)
- [ ] Upload to YouTube/Loom
- [ ] Submit to ETHOnline portal

### Day 3 (If Needed)
- [ ] Fix any issues
- [ ] Add screenshots to README
- [ ] Polish demo

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| Live Demo | https://ownnet-vault.vercel.app/ |
| GitHub | https://github.com/apondi-art/ownnet-vault |
| ETHOnline | https://ethonline.org/ |
| Pinata | https://pinata.cloud |
| Sepolia Faucet | https://sepoliafaucet.com/ |

---

## 🎯 Quick Checklist Before Submitting

- [ ] Live demo is working
- [ ] Video is recorded and uploaded
- [ ] GitHub repo is public
- [ ] README has hackathon section
- [ ] All sponsor technologies are mentioned
- [ ] Project description is clear and concise
- [ ] Team members are listed
- [ ] Correct track selected

---

## 💡 Tips for Success

### During Judging

1. **Be available** - Respond to judge questions quickly
2. **Know your tech** - Be ready to explain architecture
3. **Show passion** - Explain WHY you built this
4. **Highlight innovation** - What's unique about your approach?

### Common Questions to Prepare

**Q: Why not use existing solutions like Dropbox with encryption?**

A: Dropbox still sees your data. With OwnNet, files are encrypted BEFORE they leave your device. We never see your data or keys.

**Q: What if you shut down?**

A: All data is on IPFS and blockchain. Users can access their files using their recovery phrase, independent of us.

**Q: How do you make money?**

A: Freemium model - free tier with paid storage upgrades. The key is we can't see user data regardless.

**Q: What about key loss?**

A: 12-word recovery phrase. Users must back it up. We're adding social recovery for future versions.

---

## 📞 Need Help?

If you're stuck during submission:

1. Check the ETHOnline Discord for announcements
2. Review tracks and requirements at ethonline.org
3. Make sure all links are publicly accessible
4. Test your demo before final submission

---

**Good luck! You've built something great! 🚀**