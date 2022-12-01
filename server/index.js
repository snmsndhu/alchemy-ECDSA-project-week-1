const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04f2ca09644679c44100151a6c62d39edc1a52b1bd74ce99c25b1c5733ca6438e95fa7b2715587d26a73ffda76d7457d97125ea150b70e074db18db8ab89fca091": 100,
  "048c0fb4d05ba32fdda76cecdd430a53cb1bb83e6dc09be16dd37340309a07c0c42976da5d2323cb3ebbaeb0a4f38082f9d67394f1b49754892e275640bdc96078": 50,
  "043408204f50fd1b0055eefe979b062f965b42f9667becedc858dc1cc4e3393f2c8df10aa33d542cf501f716066b3246dcc8f8095ece5c0a3dd4cdd535e30a7515": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
