# Workshop Preparation

## Get yourself an AWS account

- Get your credit card ready.
- Get your mobile phone ready.
- Visit [Amazon Web Service](aws.amazon.com).
- Click the `Create an AWS Account` button on the top-right corner :arrow_upper_right:
- Follow the instructions.

Warning: complete this before you come to the workshop.

## Get yourself a development environment

- Most preferred: Mac / Linux (native)
- Less preferred: any computers running a Linux virtual machine
- For Linux:
  - Preferred distribution: Ubuntu
  - 64-bit
  - Run the following to keep your distribution up-to-date:
  ```
  sudo apt-get update
  sudo apt-get dist-upgrade
  ```
  - Reboot if necessary

- For Mac
  - Make sure you know how to run commands through **terminal**.
  - If not, you should **walk out of this workshop** as you should

### Install Node JS

- Make sure you are the sudoer of your Mac / Linux
- Run the following.

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install AWS CLI

**Warning**. You must have your AWS account ready.

```
sudo apt-get install awscli
aws configure
```

###
