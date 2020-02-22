#!/bin/bash

REMOTE_USER_NAME="webmaster"
REMOTE_HOST="khaleesi.app"
REMOTE_LOGIN="${REMOTE_USER_NAME}@${REMOTE_HOST}"
REMOTE_PATH_HTML="/docker/docker-nextcloud/static/selbermacher"
# PATH_LOCAL_SSHCERT="~/Documents/own/selbermacher/aws-ssh-keys/aws-selbermacher-00000001.pem"
SCRIPT_PREFIX="### Deploy Script for ${REMOTE_LOGIN} :"

echo "${SCRIPT_PREFIX} START"
if [ -f dist.tar.gz ]
then
	echo "${SCRIPT_PREFIX} Delete old dist files archive."
	rm dist.tar.gz
fi

echo "${SCRIPT_PREFIX} Compress new local dist files."
tar -C dist/trajan/ -czf dist.tar.gz .

if ssh $REMOTE_LOGIN stat "/home/${REMOTE_USER_NAME}/dist.tar.gz" \> /dev/null 2\>\&1
then
	echo "${SCRIPT_PREFIX} Delete old dist files archive."
	ssh $REMOTE_LOGIN rm "/home/${REMOTE_USER_NAME}/dist.tar.gz"
fi

echo "${SCRIPT_PREFIX} Upload new dist files."
scp dist.tar.gz "${REMOTE_LOGIN}:/home/${REMOTE_USER_NAME}/"

echo "${SCRIPT_PREFIX} Delete old dist files."
ssh $REMOTE_LOGIN rm -fr "${REMOTE_PATH_HTML}/*"

echo "${SCRIPT_PREFIX} Extract new dist files."
ssh $REMOTE_LOGIN tar xzf "/home/${REMOTE_USER_NAME}/dist.tar.gz" -C "${REMOTE_PATH_HTML}/"

# echo "${SCRIPT_PREFIX} Set permissions of new dist files."
# ssh $REMOTE_LOGIN chgrp -R nginx "${REMOTE_PATH_HTML}/*"

echo "${SCRIPT_PREFIX} SUCCESS"
exit 0
