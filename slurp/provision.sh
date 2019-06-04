#!/usr/bin/env bash
NODE_VERSION=v11.12.0
NODE_ARCHIVE=node-${NODE_VERSION}-linux-x64

sudo apt-get update
sudo apt-get install -y build-essential git-core libssl-dev
     
wget -q https://nodejs.org/dist/${NODE_VERSION}/${NODE_ARCHIVE}.tar.xz
tar -xJf ${NODE_ARCHIVE}.tar.xz

mv ${NODE_ARCHIVE}/bin/* /usr/local/bin/
mv ${NODE_ARCHIVE}/lib/* /usr/local/lib/
mv ${NODE_ARCHIVE}/share/* /usr/local/share/
mv ${NODE_ARCHIVE}/include/* /usr/local/share/

rm -rf ${NODE_ARCHIVE} ${NODE_ARCHIVE}.tar.xz