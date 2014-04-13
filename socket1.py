#!/usr/bin/env python
# -*-coding:utf-8-*-

import socket
import select
import Queue
import sys

def socketio(sock):
    """
    
    Arguments:
    - `sock`:
    """
    ilst = [sock, sys.stdin]
    olst = []
    ique = Queue.Queue()
    oque = Queue.Queue()
    connect = False
    while True:
        #socket i/o
        rlst, wlst, xlst = select.select(ilst, olst, [], 0)
        for si in rlst:
                #accept?
            if si == sock:
                if not connect:
                        #connect
                    conn, address = si.accept()
                    print 'connect', address
                    connect = True
                    ilst.append(conn)
                    olst.append(conn)
                else:
                        #discard
                    conn, address = si.accept()
                    conn.shutdown(socket.SHUT_RDWR)
                    conn.close
            elif si == sys.stdin:
                data = sys.stdin.readline()
                oque.put(data)
            else:
                    #recv?
                data = si.recv(1024)
                if data:
                    ique.put(data)
                else:
                        #disconnect
                    print 'disconnect'
                    connect = False
                    ilst.remove(si)
                    olst.remove(si)
                    si.close
                    with ique.mutex:
                        ique.queue.clear()
                    with oque.mutex:
                        oque.queue.clear()
        for so in wlst:
            if not oque.empty():
                            #send
                data = oque.get_nowait()
                so.send(data)
                            #test
            if not ique.empty():
                data = ique.get_nowait()
                print data

def start(host, port):
    """
                                            """
    try:
        #socket関数の引数の指定
        #AF_INET→IPv4 インターネット・プロトコル
        #SOCK_STREAM→TCP/IPを用いたSTREAM型のソケット使用
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        #SOL_SOCKETsetsockeoptでソケットオプションの指定
        #SO_REUSEADDR→前回のTCPセッションが残っていてもbind
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

        #作製したソケットを変数host,portでバインド
        sock.bind((host, port))

        #リクエストの接続キューを1に設定して、接続要求の準備
        sock.listen(1)

        
        socketio(sock)
    except KeyboardInterrupt:
        print '\nbreak'
        sock.shutdown(socket.SHUT_RDWR)
        sock.close()

if __name__=="__main__":
    start('', 5555)
