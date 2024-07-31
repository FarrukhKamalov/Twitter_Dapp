import { useEffect, useState } from "react";

const ProfileCreation = ({ checkProfile, profileContract, account }) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const createProfile = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await profileContract.methods
        .setProfile(username, bio)
        .send({ from: account });
      checkProfile();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile-form">
      <h2>Create your profile</h2>
      <form onSubmit={createProfile}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="profile-input"
          />
        </label>
        <label>
          Bio:
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="profile-input"
          />
        </label>
        <button type="submit" className="profile-submit">
          {loading ? <div className="spinner"></div> : <>Create Profile</>}
        </button>
      </form>
    </div>
  );
};

export default ProfileCreation;
