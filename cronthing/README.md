## Make executable
If intending to run the file with `./bin.py` (instead of `python bin.py`), you must first make the file executable with `chmod +x bin.py`.

## Run interactively on command line
`./bin.py 16:10` or `python bin.py 16:10`.

## Run with file as standard input
`./bin.py 16:10 < config` or `python bin.py 16:10 < config`.

## Run with string as standard input
`./bin.py 16:10 <<< "* * /dev/null"` or `python bin.py 16:10 <<< "* * /dev/null"`.

## Approach
If we can fix the the wildcard hours and minutes to the nearest possible runtime then we can simply do a time comparison to determine if the command should execute today or tomorrow.
