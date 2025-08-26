set -e
HOST="$1"
html=$(curl -sSf "$HOST")
echo "$html" | grep -qi '<div id="root"\|<div id="app"'

asset=$(echo "$html" | sed -n 's#.*src="\([^"]*assets/[^"]*\.js\)".*#\1#p;T;q')
curl -sSI "$HOST$asset" | grep -qi '200'

curl -sSf "$HOST/pricing" | grep -qi '<html'
curl -sSf "$HOST/xyz-nonexistent" | grep -qi '<html'

