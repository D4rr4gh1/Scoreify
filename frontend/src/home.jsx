function Home() {
    return (
        <div>
            <h1>Welcome to Scoreify 🎵</h1>

            <form>
                <button formaction="http://127.0.0.1:8000/scoreify/callback/">Login</button>
            </form>
        </div>

    );
  }
  export default Home;