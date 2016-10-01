#!/usr/bin/sh

wd=$(pwd)
script_path="$wd/scripts"
build_path="$wd/build"
resource_path="$wd/resources"

deploy_path="/srv/http/space-assaulter"
cgi_deploy_path="/srv/http/cgi-bin"
js_deploy_path="$deploy_path/build"
resource_deploy_path="$deploy_path/resources"

cd $cgi_deploy_path
rm createid.cgi destroyid.cgi getmessages.cgi listids.cgi sendmessage.cgi

cd $script_path
cp createid.py $cgi_deploy_path/createid.cgi
cp destroyid.py $cgi_deploy_path/destroyid.cgi
cp getmessages.py $cgi_deploy_path/getmessages.cgi
cp listids.py $cgi_deploy_path/listids.cgi
cp sendmessage.py $cgi_deploy_path/sendmessage.cgi

rm -r $js_deploy_path
rm -r $resource_deploy_path
cp -r $build_path $js_deploy_path
cp -r $resource_path $resource_deploy_path
cp $wd/index.html $deploy_path/index.html
# cp $wd/config.json $deploy_path/config.json

