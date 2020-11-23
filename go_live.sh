echo "Time to build 🏗️"
npm run build
echo "Lets get it on Heroku ⛰️"
mkdir dist/uploads
touch dist/uploads/.gitkeep
git push heroku master