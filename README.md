# objgen-js

ObjGen.js is a code and data generation package that allows users to express and generate complex content using a simple model based templating syntax.

The ObjGen.js Node package is the code that enables the Live JSON Generator available at [objgen.com](http://objgen.com/json) - To see the generator in action, check out the [live demo](http://objgen.com/json/?demo=true).

## JSON Generator

- JSON properties are defined by entering names
- Data types are specified using a simple convention:
  - s (or string) = string, textual data
  - n (or number) = numbeical data
  - d (or date) = date/time
  - b (or bool) = booleans
  - [] = to define an array
- Data types can be abbreviated since the first character is significant: str, num, bool, etc.
- Complex types and data are created by nesting (or tabbing) new properties in a new level. For example:

```
id n
name s
phones
  work s
  cell s
```

will generate:

```js
{
  "id": 0,
  "name": "",
  "phones": {
    "work": "",
    "cell": ""
  }
}
```

Arrays are defined by using bracket syntax '[]'. For example:

```
id n = 12123434
name = Joe Rightsman
address[0]
  street=100 East Main Street
  city=Southernville
  state=NY
  zip=19910
address[1]
  street=100 West Birch Lane
  city=Northnville
  state=NY
  zip=19911
```

will generate:

```js
{
  "id": 12123434,
  "name": "Joe Rightsman",
  "address": [
    {
      "street": "100 East Main Street",
      "city": "Southernville",
      "state": "NY",
      "zip": "19910"
    },
    {
      "street": "100 West Birch Lane",
      "city": "Northnville",
      "state": "NY",
      "zip": "19911"
    }
  ]
}
```

Assignments are defined by using the equal sign '='. For example:

```
id n = 0
name = Dave Kingman
```

will generate:

```js
{
  "id": 0,
  "name": "Dave Kingman"
}
```

Any assignment for a property that does not include a data type, defaults to a string.

Dates values default to the current date, but can be assigned using a variety of parseable date values. For example:

```
id n = 0
name = Dave Kingman
dateOfBirth d = 2112/12/21
```

will generate:

```js
{
  "id": 0,
  "name": "Dave Kingman",
  "dateOfBirth": "2112-12-21T05:00:00.000Z"
}
```

## Installation

1. Get [node](https://nodejs.org)
2. `npm install objgen --save` or globally with `npm install -g objgen` for command line usage
3. Verify `-g` installation

```sh
$ objgen --version
4.0
```

## Usage

### JavaScript - Calling the JSON Generator

```js
var ObjGen = require('./objgen.js').ObjGen;

var model = "id n = 100\n" +
  "title = Welcome to New York\n" +
  "releaseDate d = 2017-02-10";

var json = ObjGen.xJson(model, {numSpaces: 2});

console.log(json);
```

generates:

```js
{
  "id": 100,
  "title": "Welcome to New York",
  "releaseDate": "2017-02-10T00:00:00.000Z"
}
```

### Command line - Run the JSON generation demo

```sh
$ objgen -d

Input model:

// Model & generate Live JSON data values
// interactively using a simple syntax.
// String is the default value type
product = ObjGen Live JSON generator

// Number, Date & Boolean are also supported
// Specify types after property names
version n = 4.0
releaseDate d = 2017-02-10
demo b = true

// Tabs or spaces define complex values
person
  id number = 12345
  name = John Doe
  phones
    home = 800-123-4567
    mobile = 877-123-1234

  // Use [] to define simple type arrays
  email[] s = jd@example.com, jd@example.org
  dateOfBirth d = 1990-01-02
  registered b = true

  // Use [n] to define object arrays
  emergencyContacts[0]
    name s = Jane Doe
    phone s = 888-555-1212
    relationship = spouse
  emergencyContacts[1]
    name s = Justin Doe
    phone s = 877-123-1212
    relationship = parent

// See http://objgen.com for additional info
// We hope you enjoy the tool!


Generated JSON:

{
  "product": "ObjGen Live JSON generator",
  "version": 4,
  "releaseDate": "2017-02-10T00:00:00.000Z",
  "demo": true,
  "person": {
    "id": 12345,
    "name": "John Doe",
    "phones": {
      "home": "800-123-4567",
      "mobile": "877-123-1234"
    },
    "email": [
      "jd@example.com",
      "jd@example.org"
    ],
    "dateOfBirth": "1990-01-02T00:00:00.000Z",
    "registered": true,
    "emergencyContacts": [
      {
        "name": "Jane Doe",
        "phone": "888-555-1212",
        "relationship": "spouse"
      },
      {
        "name": "Justin Doe",
        "phone": "877-123-1212",
        "relationship": "parent"
      }
    ]
  }
}
```

### Command line - Generate JSON from your own model files:

```sh
$ objgen -f my-model.txt
```
