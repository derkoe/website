+++
categories = []
date = 2020-05-25T00:00:00Z
draft = true
title = "Development Environment in WSL2"

+++
# Development Environment in WSL2

This guide shows how to setup a full development environment in WSL2 on Windows 10.

## Why?

## Enable WSL2 and Install Ubuntu

For WSL2 to work you will need a Windows 10 build 19041 or higher (any edition will work, even Home). Then simply follow the [guide from Microsoft](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install "Windows Subsystem for Linux Installation Guide for Windows 10"). 

TL;DR: 

1. Enable the feature (in Admin Powershell):
   ```
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```
2. Restart Windows
3. Set WSL2 as default:
   ```
   wsl --set-default-version 2
   ```
4. Go to the Microsoft Store and install "Ubuntu"


## Resources

* [Windows Subsystem for Linux (WSL): The Ultimate Guide](https://adamtheautomator.com/windows-subsystem-for-linux/ "Windows Subsystem for Linux (WSL): The Ultimate Guide")