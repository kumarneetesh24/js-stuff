import React from 'react';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: "/*add your jsx here */",
      output: "",
      error: "",
    }
    this.update = this.update.bind(this);
  }
  update(e){
    let code = e.target.value;
    try {
        this.setState({
          output: babel.transform(code,{
            stage: 0,
            loose: 'all'
          }).code
        })
    } catch (error) {
        this.setState({error: error.message})
    }
  }
  render(){
    return (
      <div>
        <header> {this.state.error} </header>
        <div class = "container" >
          <textarea onChange={this.update}
            defaultValue={this.state.input}>
          </textarea>
          <pre>
            {this.state.output}
          </pre>
        </div>
      </div>
      )
  }
}

export default App
