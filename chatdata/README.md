# Chat Data Sentiment Polarity Experiment
Using faux chat data we use textblob (and nltk) to build a flask web application that shows information about how different support agents are able to affect change in the sentiment polarity of messages sent by customers.

This could easily be extended to show average sentiment polarity per page where chats are requested, or to simply show which page urls chats are most commonly requested from.

```
pip install -r pip-requirements
make corpus # downloads textblob lite corpora to enable to the sentiment analysis
python application.py
```