from datetime import datetime
from hashlib import sha256

def get_token(size=16):
  """
  Will return a unique character sequence each time it's called.
  Default size of sequence is 16.

  How this works (Fun piece of info):

  sha256 is a function in the hashlib library that will generate a random sequence
  of characters for us.
  To help ensure randomness, we can provide it a "seed" value. Seed values are used
  to generate the random sequence.
  Here we use the current datetime. Since the datetime is constantly changing, this
  helps ensure a truly random character sequence.
  
  sha256 returns a pretty long sequence, so we just chop off the last 16 characters
  and use that as our token value.

  Having a truly random 16 character sequence means that we can reasonably expect each
  sequence to be unique. If each sequence is unique, then we can use it inside our URL
  to refer to individual objects reliably.
  """
  token = sha256(str(datetime.now()).encode('utf-8')).hexdigest()[:size]
  return token
