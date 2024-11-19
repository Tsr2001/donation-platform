import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import abi from './abi.json';
import './App.css';

const App = () => {
  const [account, setAccount] = useState(null);
  const [goals, setGoals] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
        setContract(contractInstance);

        await loadGoals(contractInstance);
      } else {
        alert("Please install MetaMask to use this feature.");
      }
    }

    loadWeb3();
  }, []);

  

  const loadGoals = async (contractInstance) => {
    const goals = await contractInstance.methods.getGoals().call();
    setGoals(goals);
  };

  const handleCreateGoal = async () => {
    try {
      console.log("Creating goal with:", description, "Amount:", amount);
      await contract.methods.createGoal(description, web3.utils.toWei(amount, 'ether')).send({
        from: account,
        gas: 8000000 // Ensure there is NO 'value' field here
        
      });
      alert("Goal created successfully!");
      await loadGoals(contract);
    } catch (error) {
      console.error("Error creating goal:", error);
      alert(`Failed to create goal: ${error.message}`);
    }
  };
  


  const handleDonate = async (goalId) => {
    try {
      const donationAmount = prompt("Enter amount to donate in ETH:");
      await contract.methods.donate(goalId).send({
        from: account,
        value: web3.utils.toWei(donationAmount, 'ether')
      });
      alert("Donation successful!");
      await loadGoals(contract);
    } catch (error) {
      console.error("Error making donation:", error);
      alert(`Error making donation: ${error.message}`);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await contract.methods.deleteGoal(goalId).send({ from: account });
      alert("Goal deleted successfully!");
      await loadGoals(contract);
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert(`Error deleting goal: ${error.message}`);
    }
  };

  const handleWithdraw = async () => {
    try {
      const withdrawAmount = prompt("Enter amount to withdraw in ETH:");
      await contract.methods.withdraw(web3.utils.toWei(withdrawAmount, 'ether')).send({
        from: account
      });
      alert("Withdrawal successful!");
      await loadGoals(contract); // Reload goals to reflect updated balance
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert(`Error withdrawing funds: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <h1> Decentralized Charity Donation Platform</h1>
      <button className="connect-wallet" onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
        Connect Wallet
      </button>
      {account && (
        <div>
          <h3>Connected account: {account}</h3>

          <h2>Charity Goals</h2>
          <ul>
            {goals.map((goal, index) => (
              <li key={index}>
                <p><strong>Description:</strong> {goal.description}</p>
                <p><strong>Amount Needed:</strong> {web3.utils.fromWei(goal.amount, 'ether')} ETH</p>
                <p><strong>Raised:</strong> {web3.utils.fromWei(goal.raised, 'ether')} ETH</p>
                <p className="status"><strong>Status:</strong> {goal.completed ? "Completed" : "In Progress"}</p>
                <div className="button-group">
                  <button className="primary" onClick={() => handleDonate(index)}>Donate</button>
                  <button className="danger" onClick={() => handleDeleteGoal(index)}>Delete Goal</button>
                </div>
              </li>
            ))}
          </ul>

          <h2>Create New Goal</h2>
          <input
            type="text"
            placeholder="Goal Description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount in ETH"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="primary" onClick={handleCreateGoal}>Create Goal</button>

          <h2>Withdraw Funds</h2>
          <button className="primary" onClick={handleWithdraw}>Withdraw</button>
        </div>
      )}
    </div>
  );
};

export default App; 