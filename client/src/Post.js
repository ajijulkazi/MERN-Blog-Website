export default function Post(){
    return(
        <div className="post">
          <div className="image">
            <img src="https://techcrunch.com/wp-content/uploads/2023/01/loona-petbot-2.jpg?w=1390&crop=1" alt="" />
          </div>
          <div className="texts">
          <h2>Like me, Loona the Petbot is dumb but lovable</h2>
           <p className="info">
            <a className="author">Abdul Ajij</a>
            <time>2023-03-01 17:56</time>
           </p>
          <p className="summary">I have wanted a robot pet at least since Sony introduced the original Aibo in 1999 — probably earlier, but Aibo made it seem tangible.</p>
          </div>
        </div>
    );
}