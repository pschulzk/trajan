#!/bin/bash

REMOTE_USER_NAME="ec2-user"
REMOTE_HOST="18.223.43.72"
REMOTE_LOGIN="${REMOTE_USER_NAME}@${REMOTE_HOST}"
REMOTE_PATH_HTML="/usr/share/nginx/html"
PATH_LOCAL_SSHCERT="~/Documents/own/selbermacher/aws-ssh-keys/aws-selbermacher-00000001.pem"
SCRIPT_PREFIX="### Deploy Script for ${REMOTE_LOGIN} :"

echo "${SCRIPT_PREFIX} START"
if [ -f dist.tar.gz ]
then
	echo "${SCRIPT_PREFIX} Delete old dist files archive."
	rm dist.tar.gz
fi

echo "${SCRIPT_PREFIX} Compress new local dist files."
tar -C dist/trajan/ -czf dist.tar.gz .

if ssh -i $PATH_LOCAL_SSHCERT $REMOTE_LOGIN stat "/home/${REMOTE_USER_NAME}/dist.tar.gz" \> /dev/null 2\>\&1
then
	echo "${SCRIPT_PREFIX} Delete old dist files archive."
	ssh -i $PATH_LOCAL_SSHCERT $REMOTE_LOGIN sudo rm "/home/${REMOTE_USER_NAME}/dist.tar.gz"
fi

echo "${SCRIPT_PREFIX} Upload new dist files."
scp -i $PATH_LOCAL_SSHCERT dist.tar.gz "${REMOTE_LOGIN}:/home/${REMOTE_USER_NAME}/"

echo "${SCRIPT_PREFIX} Delete old dist files."
ssh -i $PATH_LOCAL_SSHCERT $REMOTE_LOGIN sudo rm -fr "${REMOTE_PATH_HTML}/*"

echo "${SCRIPT_PREFIX} Extract new dist files."
ssh -i $PATH_LOCAL_SSHCERT $REMOTE_LOGIN sudo tar xzf "/home/${REMOTE_USER_NAME}/dist.tar.gz" -C "${REMOTE_PATH_HTML}/"

echo "${SCRIPT_PREFIX} Set permissions of new dist files."
ssh -i $PATH_LOCAL_SSHCERT $REMOTE_LOGIN sudo chgrp -R nginx "${REMOTE_PATH_HTML}/*"

echo "${SCRIPT_PREFIX} SUCCESS"
exit 0
