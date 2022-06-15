# TaskSyncer

Provide a ticket like API for syncing asynchronous tasks

## Installation

`npm install --save task-syncer`
OR
`yarn add task-syncer`

## Usage

```javascript
const fs = require('fs');

const TaskSyncer = require('task-syncer');

async function main () {
    const syncer = new TaskSyncer();
    const files = ['./foo', './bar'];
    await Promise.all(files.map(async file => {
        const ticket = syncer.getTicket();
        const content = await fs.promises.readFile(file, 'utf8');
        await ticket.ready;
        console.log(file);
        console.log(content);
    });
}

main.then(
    () => console.log('end with success'),
    error => console.log('end with error', error)
);
```

Without TaskSyncer, the reading of the files *and* the console.log calls are all asynchronous, the strings written on the output can overlap each other, the output can be :

```
./bar
./foo
"./foo" content text
"./bar" content text
```

With TaskSyncer, the reading of the files is still asynchronous and parallel, but the output is synchronous :


```
./foo
"./foo" content text
./bar
"./bar" content text
```
