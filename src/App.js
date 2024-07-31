import "./styles.css";
import { useEffect, useState } from "react";

import Tweets from "./components/Tweets";
import AddTweet from "./components/AddTweet";
import Connect from "./components/Connect";
import ProfileCreation from "./components/ProfileCreation";

export default function App() {
  const [account, setAccount] = useState(null);
  const [profileExists, setProfileExists] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [profileContract, setProfileContract] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getTweets() {
    if (!web3 || !contract) {
      console.error("Web3 or contract not initialized.");
      return;
    }

    const tempTweets = await contract.methods.getAllTweets(account).call();
    // we do this so we can sort the tweets by timestamp
    const tweets = [...tempTweets];
    tweets.sort((a, b) => b.timestamp - a.timestamp);
    setTweets(tweets);
    setLoading(false);
  }

  async function checkProfile() {
    const userProfile = await getProfile(account);

    setProfileExists(userProfile);
  }

  async function getProfile() {
    if (!web3 || !profileContract || !account) {
      console.error(
        "Web3 or profileContract not initialized or account not connected."
      );
      return;
    }

    const profile = await profileContract.methods.getProfile(account).call();
    setLoading(false);
    return profile.displayName;
  }

  useEffect(() => {
    if (contract && account) {
      if (profileExists) {
        getTweets();
      } else {
        checkProfile();
      }
    }
  }, [contract, account, profileExists]);

  function shortAddress(address, startLength = 6, endLength = 4) {
    if (address === account && profileExists) {
      return profileExists;
    } else if (address) {
      return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
    }
  }

  return (
    <div className="container">
      <h1>Twitter DAPP</h1>
      <Connect
        web3={web3}
        setWeb3={setWeb3}
        account={account}
        setAccount={setAccount}
        setContract={setContract}
        shortAddress={shortAddress}
        setProfileContract={setProfileContract}
      />
      {!loading && account && profileExists ? (
        <>
          <AddTweet
            contract={contract}
            account={account}
            getTweets={getTweets}
          />
          <Tweets tweets={tweets} shortAddress={shortAddress} />
        </>
      ) : (
        account &&
        !loading && (
          <ProfileCreation
            account={account}
            profileContract={profileContract}
            checkProfile={checkProfile}
          />
        )
      )}
    </div>
  );
}
