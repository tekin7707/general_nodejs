C:\works\tekin\heroku\lades

npm init

npm install express --save
npm install nodemon --save
npm install mongoose --save
npm install cors --save
npm install jwt-simple --save

-----
node_modules klasörünü git e göndermez
echo "node_modules" >> .gitignore

//username ve password saklaması için
git config credential.helper store
-----
//username ve password istemesi için
git credential-manager uninstall

git config --global user.email "tekin7707@gmail.com"
git config --global user.name "tekin7707"

git add .
git commit -m  "first"
git push origin master