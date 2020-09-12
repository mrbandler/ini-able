# A able `*.ini` CLI

[![GitHub license](https://img.shields.io/github/license/mrbandler/ini-able)](https://github.com/mrbandler/ini-able/blob/master/LICENSE)
[![Actions status](https://github.com/mrbandler/ini-able/workflows/build/badge.svg)](https://github.com/mrbandler/ini-able/actions)
[![npm version](https://badge.fury.io/js/ini-able.svg)](https://badge.fury.io/js/ini-able)

[![Donate with Bitcoin](https://en.cryptobadges.io/badge/micro/3LTBGYAHQCDE4ZbEiTreJjzgnsDhY6X2D2)](https://en.cryptobadges.io/donate/3LTBGYAHQCDE4ZbEiTreJjzgnsDhY6X2D2)
[![Donate with Litecoin](https://en.cryptobadges.io/badge/micro/LcHsJH13A8PmHJQwpbWevGUebZwhWNMXgS)](https://en.cryptobadges.io/donate/LcHsJH13A8PmHJQwpbWevGUebZwhWNMXgS)
[![Donate with Ethereum](https://en.cryptobadges.io/badge/micro/0x54499ee409687E9C43589693093D004a0cbfEE72)](https://en.cryptobadges.io/donate/0x54499ee409687E9C43589693093D004a0cbfEE72)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/mrbandler/)

**Small `*.ini` command line tool, as I could not find one that did what I wanted.**

## Table Of Content

1. [Idea and Use Case](#1-idea-and-use-case) 🤔
2. [Installation](#2-installation) 💻
3. [Usage](#3-usage) ⌨️
4. [Bugs and Features](#4-bugs-and-features) 🐞💡
5. [Buy me a coffee](#5-buy-me-a-coffee) ☕
6. [License](#6-license) 📃

---

## 1. Idea and Use Case

> ℹ️ **ini-able** can be used like any other `*.ini` command line interface out there, it just handles special cases for Unreal Engine 4 `*.ini` files.

**ini-able** is just like any other `*.ini` command line interface (CLI), it just has the ability to modify Unreal Engine 4 `*.ini` files which are a bit of a special case in that realm.

The problem with Unreal Engine 4 `*.ini` files are the following entries:

```ini
[/Script/Engine.Engine]
+ActiveGameNameRedirects=(OldGameName="TP_PuzzleBP",NewGameName="/Script/Test")
```

Standard parsers cannot handle the `+` in front of the actual key. **ini-able** midigates that by parsing Unreal Engine 4 alternations before hand and converting it to a form a standard `*.ini` parser can use. After a successful operation **ini-able** converts the alternations back to Unreal Engine 4 usable form.

Our main use case here at [fivefingergames GmbH](https://fivefingergames.com) is the automated build process of our Unreal Engine 4 projects, with **ini-able** we can switch the needed values within the projects `*.ini` files to perform our desired build.

## 2. Installation

The CLI can easily be installed over [npm](https://www.npmjs.com/) (Node Package Manager). Which can be installed by installing [nodejs](https://nodejs.org/).

Installing machine wide:

```bash
$ npm install -g ini-able

OR

$ yarn global ini-able
```

Installing to local project:

```bash
$ npm install ini-able

OR

$ yarn add ini-able
```

That's it, now you're up and running!

## 3. Usage

The CLI currently only exposes one command, the `set` command.
For a quick glance on how to use it use the commands help page.

```bash
$ ini-able set --help

Usage: ini-able set [options] <value>

Sets a property value.

Options:
  -f, --file [file]        *.ini file to set the property to.
  -o, --out [file]         *.ini file to write to.
  -s, --section [section]  Section where to change the property.
  -k, --key [key]          Key where to change the property.
  -e, --eval               Indecates that the value given is a expression that needs to be evaluated.
  -h, --help               output usage information
```

> ⚠️ After `set` exection the `*.ini` contents could potentially be sorted differently.

### Examples

All examples will be based on the [`Test.ini`](https://github.com/mrbandler/ini-able/blob/master/Test.ini), which is a `*.ini` file from an Unreal Engine 4 project.

### Basic Example

In this example we will change a key on the file level section.

Given the following `*.ini` contents:

```ini
bAllowControllers=True
bUseRemoteAsVirtualJoystick=True
```

We execute the following command:

```bash
$ ini-able set False -f ./Test.ini -k bAllowControllers
```

Which results in:

```ini
bAllowControllers=False
bUseRemoteAsVirtualJoystick=True
```

### Section Example

In this example we will change a key on a specific section.

Given the following `*.ini` contents:

```ini
[URL]
GameName=Test

[/Script/IOSRuntimeSettings.IOSRuntimeSettings]
MinimumiOSVersion=IOS_10
bAllowControllers=True
bUseRemoteAsVirtualJoystick=True
bAllowRemoteRotation=True
BundleIdentifier=com.fivefingergames.Test
RemoteServerName=Charon
RSyncUsername=fivefingergames
SigningCertificate=iPhone Distribution: fivefingergames GmbH
MobileProvision=Test.mobileprovision
bShipForBitcode=False
```

We execute the following command:

```bash
$ ini-able set False -f ./Test.ini -s "/Script/IOSRuntimeSettings.IOSRuntimeSettings" -k bAllowControllers
```

Which results in:

```ini
[URL]
GameName=Test

[/Script/IOSRuntimeSettings.IOSRuntimeSettings]
MinimumiOSVersion=IOS_10
bAllowControllers=False
bUseRemoteAsVirtualJoystick=True
bAllowRemoteRotation=True
BundleIdentifier=com.fivefingergames.Test
RemoteServerName=Charon
RSyncUsername=fivefingergames
SigningCertificate=iPhone Distribution: fivefingergames GmbH
MobileProvision=Test.mobileprovision
bShipForBitcode=False
```

###

## 4. Bugs and Features

Please open a issue when you encounter any bugs 🐞 or if you have an idea for a additional feature 💡.

## 5. Buy me a coffee

If you like you can buy me a coffee:

[![Support via PayPal](https://cdn.rawgit.com/twolfson/paypal-github-button/1.0.0/dist/button.svg)](https://www.paypal.me/mrbandler/)

[![Donate with Bitcoin](https://en.cryptobadges.io/badge/big/3LTBGYAHQCDE4ZbEiTreJjzgnsDhY6X2D2)](https://en.cryptobadges.io/donate/3LTBGYAHQCDE4ZbEiTreJjzgnsDhY6X2D2)

[![Donate with Litecoin](https://en.cryptobadges.io/badge/big/LcHsJH13A8PmHJQwpbWevGUebZwhWNMXgS)](https://en.cryptobadges.io/donate/LcHsJH13A8PmHJQwpbWevGUebZwhWNMXgS)

[![Donate with Ethereum](https://en.cryptobadges.io/badge/big/0x54499ee409687E9C43589693093D004a0cbfEE72)](https://en.cryptobadges.io/donate/0x54499ee409687E9C43589693093D004a0cbfEE72)

---

## 6. License

MIT License

Copyright (c) 2019 mrbandler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
