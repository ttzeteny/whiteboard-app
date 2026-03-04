import '../Style/App.css';
import '../Style/Profile.css';

function ProfileUI({ user, onLogout, onDelete, onNavigateDashboard }) {
  return (
    <div className="App">
      <nav className="navbar">
        <h1><a href="/dashboard">BOARD IT</a></h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff&rounded=true`} 
            alt="avatar" 
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        </div>
      </nav>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <button className="sidebar-link active">Account Settings</button>
          <button className="sidebar-link" onClick={onNavigateDashboard}>Dashboard</button>
          <hr />
          <button className="sidebar-link logout-link" onClick={onLogout}>Log Out</button>
        </aside>

        <main className="profile-content">
          <h2>Account Settings</h2>
          <p className="profile-subtitle">Your profile information</p>

          <div className="settings-panel">
            <div className="settings-header">
              <h3>Public Profile</h3>
            </div>
            <div className="settings-body profile-info-row">
              <img 
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff&size=80&rounded=true`} 
                alt="Profile" 
                className="profile-large-avatar"
              />
              <div className="profile-data">
                <div className="data-field">
                  <label>Username</label>
                  <input type="text" value={user.name} readOnly />
                </div>
                <div className="data-field">
                  <label>Email Address</label>
                  <input type="email" value={user.email} readOnly />
                  <p className="field-help">Your email is private</p>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-panel danger-zone">
            <div className="settings-header">
              <h3>Danger Zone</h3>
            </div>
            <div className="settings-body danger-row">
              <div>
                <h4>Delete this account</h4>
                <p>Once you delete your account, there is no going back. All your workspaces and drawings will be permanently removed.</p>
              </div>
              <button onClick={onDelete} className="delete-account-btn">
                Delete Account
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProfileUI;