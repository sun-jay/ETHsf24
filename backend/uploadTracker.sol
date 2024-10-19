// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

contract VideoUploadTracker {
    struct VideoInfo {
        string filename;
        bool status;
        string key;
        address walletAddress;
        string message;
    }

    mapping(address => VideoInfo[]) private userUploads;
    VideoInfo[] private allUploads;

    function uploadVideoInformation(
        string memory _filename,
        bool _status,
        string memory _key,
        string memory _message
    ) public {
        VideoInfo memory newVideo = VideoInfo({
            filename: _filename,
            status: _status,
            key: _key,
            walletAddress: msg.sender,
            message: _message
        });

        userUploads[msg.sender].push(newVideo);
        allUploads.push(newVideo);
    }

    function getAllUploads() public view returns (VideoInfo[] memory) {
        return allUploads;
    }

    function getAllUploadsByUser(address _user) public view returns (VideoInfo[] memory) {
        return userUploads[_user];
    }
}