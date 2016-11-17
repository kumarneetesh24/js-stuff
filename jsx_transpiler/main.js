import React for react;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: "/*add your jsx here */",
      output: "",
      error: "",
    }
  }
  this.update = this.update.bind(this);
  render(){
    return (
      <div>
        <header> this.state.error </header>
        <div class = "container" >
          <textarea onChange={this.update}
            defaultValue={this.state.input}
          </textarea>
          <pre> {this.state.output}</pre>
      </div>
    );
  }
}

export default App
