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

1. Enable the features WSL and VM-Platform in Powershell as Admin:

       dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
       dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
2. Restart Windows
3. Set WSL2 as default:

       wsl --set-default-version 2
4. Go to the Microsoft Store and install "Ubuntu"
5. Launch Ubuntu from Start menu (this will ask you for a user account)

You can now re-launch a shell in your Ubuntu instance with "Ubuntu" from the Start menu or execute `wsl` from the command line. The WSL command line tool has many options which you can find with `wsl --help` or in the [Command Reference](https://docs.microsoft.com/en-us/windows/wsl/reference).

## Update and Install Software

Inside your Ubuntu update all packages:

    sudo apt update
    sudo apt upgrade

Then install packages you need for your development - in my case it is Java 11, Maven, Node.js/NPM and git:

    sudo apt install openjdk-11-jdk openjdk-11-source maven nodejs npm git

## X11 with X2Go

## Resources

* [Windows Subsystem for Linux (WSL): The Ultimate Guide](https://adamtheautomator.com/windows-subsystem-for-linux/ "Windows Subsystem for Linux (WSL): The Ultimate Guide")