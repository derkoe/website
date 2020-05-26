+++
categories = []
date = 2020-05-25T00:00:00Z
draft = true
title = "Development Environment in WSL2"

+++
# Development Environment in WSL2

This guide shows how to setup a full development environment including UI apps (X11) in WSL2 on Windows 10. WSL2 enables a "full" Linux development environment in Windows.

## Why?

The first thing you might ask is: why? First, we have to run Windows on our machines - so the all-in Linux does not work. Second, Linux is a lot faster for building software than Windows - our biggest app compiles in 13 minutes under Windows and in just 2 minutes under WSL on my machine which is a massive improvement.

## Enable WSL2 and Install Ubuntu

For WSL2 to work you will need a Windows 10 build 19041 (aka 20H1) or higher (any edition will work, even Home). Then simply follow the [guide from Microsoft](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install "Windows Subsystem for Linux Installation Guide for Windows 10").

**TL;DR:**

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

## GUI Apps (X11/Wayland)

Currently there is no support for GUI apps for WSL - Microsoft has [announced that they are working on GUI support using Wayland](https://devblogs.microsoft.com/commandline/the-windows-subsystem-for-linux-build-2020-summary/#wsl-gui) and that it should ship in 2020. So you have to use X11 forwarding or other tricks to enable this - I have tried all of them and there are some issues with any of the solutions:

1. X11 server on Windows ([VcXsrv](https://sourceforge.net/projects/vcxsrv/) or [X410](https://x410.dev/)) and setting the DISPLAY variable in Linux (`export DISPLAY=``ip route show | grep 'default via' | awk '{print $3}'``:0.0`).
   * Works quite well - good performance, shortcuts work, even mouse back/forward buttons work as expected
   * The main problem is that when you go to standby or hibernate the [connection between Windows and WSL breaks](https://superuser.com/questions/1474559/wsl2-x11-programs-disappear) and all your apps stop.
2. Running [xrdp](http://xrdp.org/) on Linux and using Remote Desktop to connect
   * In this case you are running a full desktop - that means you have to install Xfce (Gnome does not seem to work). 
   * With this solution the whole UI feels a bit laggy and slow - I tried to tune the xrdp params without success.
3. [Xpra](http://xpra.org/) - a virtual X11 server to connect via a client on Windows (or other platforms)
   * The solution works but there are many issues like crashes, window positions are completely wrong, extra mouse buttons do not work, etc.
4. [X2Go](https://wiki.x2go.org/) - also a virtual X11 server with an Windows client
   * This seems to be the most promising solution
   * As with plain X11: good performance, shortcuts work, even mouse back/forward buttons work as expected, plus the reconnect feature
   * The only drawback is the quirky Windows client

### Setup for X2Go 

## Resources

* [Windows Subsystem for Linux (WSL): The Ultimate Guide](https://adamtheautomator.com/windows-subsystem-for-linux/ "Windows Subsystem for Linux (WSL): The Ultimate Guide")
* [Linux on Windows: WSL with Desktop Environment via RDP](https://dev.to/darksmile92/linux-on-windows-wsl-with-desktop-environment-via-rdp-522g)
* [HOWTO: Functional Ubuntu desktop on Windows 10/WSL](https://eising.wordpress.com/2018/11/05/howto-functional-ubuntu-desktop-on-windows-10-wsl/)