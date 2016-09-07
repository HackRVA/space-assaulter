#!/usr/bin/python2

import cgi
import sys
import json
from wrap import wrap_db, wrap_cgi

def db_ops(cur, sock):
  # Use the roomid value to find offers
  form = cgi.FieldStorage()
  roomid = long(form.getvalue("id"))
  cur.execute(
    "SELECT id, sdp_type, sdp FROM offers WHERE room_id=%s AND used=FALSE LIMIT 1;", 
    (roomid, ))
  offers = [{
    "id": offerid, 
    "offer": {
      "type": sdp_type,
      "sdp": sdp
    }
  } for (offerid, sdp_type, sdp) in cur]
  if len(offers) >= 1:
    offer = offers[0]
    cur.execute("UPDATE offers SET used=TRUE WHERE id=%s;", (offer["id"], ))
    json.dump(offer, sock)
  else:
    json.dump({"error": "No available offers"}, sock)

def get_req(sock):
  wrap_db(db_ops, sock)

def main():
  wrap_cgi({'GET': get_req}, sys.stdout)

main()

