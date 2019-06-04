#!/usr/bin/env bash
VERSION=v11.11.0
DISTRIB=linux-x64
ARCHIVE=node-${VERSION}-${DISTRIB}

sudo apt-get update
sudo apt-get install -y build-essential git-core libssl-dev
     
wget -q https://nodejs.org/dist/${VERSION}/${ARCHIVE}.tar.xz
tar -xJf $ARCHIVE.tar.xz

mv $ARCHIVE/bin/* /usr/local/bin/
mv $ARCHIVE/lib/* /usr/local/lib/
mv $ARCHIVE/share/* /usr/local/share/
mv $ARCHIVE/include/* /usr/local/share/

rm -rf $ARCHIVE $ARCHIVE.tar.xz