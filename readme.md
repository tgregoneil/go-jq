 
### go-jq

For when you've finally decided to ditch the beloved jQuery library, but want to preserve the sexy jQuery syntax. $('#out').append('something'), for example maps to pure javascript.

### Installation
```shell
$ npm install go-jq
```

### Example (tst.js)

```js
import { jQ } from 'go-jq';

$('#out').append('something');
```
### bundle tst.js to main.js
```
webpack ./tst.js --devtool source-map --mode development -o .
```
### test.html
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <div id='out'></div>
    <script src='./main.js'></script>
</body>
</html>
```
### Output of test.html
```
something

```


