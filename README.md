# ReactOthello
create Othello game using React

## 参考

ReactのTutorialのtic-tac-toneをベースに改修

https://github.com/gitfer/react-tic-tac-toe

## TODO

Webで観戦・マッチング対戦

* Client ... TypeScript + React
* Server ... SignalR + C#

SignalR + React https://codingblast.com/asp-net-core-signalr-chat-react/

### 永続化が手間

* IISだと定期的に再起動がかかる
* PostgreSQLだとDB立てるのが面倒
* sqliteだとマルチスレッド対応が必要

なので、IISよりexeでオンメモリで管理。