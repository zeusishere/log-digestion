# Log Digestor

The app is used to generate stats from log files , it generates stats for -

1.  apis grouped by ResponseStatus
2.  apis grouped by time of hitting(accuracy upto minutes)
3.  api endPoints hit with respective count

## Requirements

1. Node v14.15
   .

## steps to setup project on your machine

1. clone the repository

```
git clone https://github.com/zeusishere/log-digestion.git
```

2. The node_modules is not a part of the cloned repository and should be downloaded using the npm install .

```
npm install
```

4. To run the project use .

```
node  index.js <path to logFile>
or use to write the output to a file named output.txt
node  index.js <path to logFile> > output.txt
```
