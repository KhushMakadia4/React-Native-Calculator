import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import {evaluate} from 'mathjs';

export default class App extends React.Component {
  constructor(){
    super();
  }

  state={
    inputText: "",
    outputText: "",
    prevAns: "",
    operations: ['C','+','-','*','/','^', "("],
    degRad: 'deg',
  };

  calcResult(){ 
    var text = this.state.inputText
    while (text.includes("π")) {
      var charBefPi = text.charAt(text.indexOf("π")-1)
      var piText = ""
      if (charBefPi=='+' || charBefPi=='-' || charBefPi=='*' || charBefPi=='/' || charBefPi=='^' || charBefPi=='(') {
        piText = "3.14159"
      } else {
        piText = "*3.14159"
      }
      text = text.substring(0, text.indexOf("π")) + piText + text.substring(text.indexOf("π")+1)
      // text.replace("π", piText);
      
    }
    if (text.length>=3) {
      for (let i = 0; i<text.length-4;i++) {
        if ( (text.substring(i, i+3) == 'sin' || text.substring(i, i+3) == 'cos' || text.substring(i, i+3) == 'tan') && this.state.degRad=='deg') {
          text = text.substring(0, i) + text.substring(i,i+4) + "deg " + text.substring(i+4)
        }
      }
    }

    try {
      this.setState({
        outputText: evaluate(text),
        prevAns: evaluate(text),
        inputText: "",
      })
    } catch(s) {
      alert("YOU DUMB DOO DOO HEAD YOU MESSED UP")
    }
  }

  operator(operation){
    // alert(operation)
    var textOp = this.state.inputText+operation;
    if (this.state.operations.includes(this.state.inputText.charAt(this.state.inputText.length-1)) && !(operation=='(')) {
      return
    }

    if (this.state.inputText == "") {
      if (this.state.prevAns == "") {
        return
      } else {
        textOp = this.state.prevAns+operation;
        if (operation == "(" || operation == ")") {
          textOp = operation;
        }
      }
    }
    if(operation=='C') {
      var text = this.state.inputText.split('')
      text.pop()
      this.setState({
        inputText: "",
        outputText: "",
      })
    } else {
      this.setState({
        inputText: textOp
      }) 
    }
  }


  check() {
    var lastOper = this.state.inputText.charAt(this.state.inputText.length-1);
    // string lastOper = text.substring()
    if (lastOper=="+" || lastOper=="-" || lastOper=="*" || lastOper=="/" || lastOper=="^") {
      alert("LEARN HOW TO USE A CALCULATOR")
      this.setState({
        inputText: "",
      })
      return false
    }
    return true
  }


  btnPress(text){
    var textFin = this.state.inputText+text
    if(text == '='){
      return this.check() &&  this.calcResult()
    } else if (text == 'π' && textFin.charAt(textFin.length-2)==".") {
      alert("WHAT WERE YOU THINKING?")
      this.setState({
        inputText:'',
        outputText:'',
      })
      return
    } else if (text == 'deg' || text == 'rad') {
      switch (text) {
        case 'deg':
          this.setState({
            degRad: 'rad',
          })
          break
        case 'rad':
          this.setState({
            degRad: 'deg',
          })  
          break
      }
      return;
    }
    if (this.state.inputText.charAt(this.state.inputText.length-1) =="π") {
      textFin = this.state.inputText+"*"+text
    }
    this.setState({
      inputText: textFin
    })
  }



  render() {
    
    var ops = [];
    var opers = ['C','+','-','*','/','^', "(", ")"];
    for(let i=0; i<opers.length; i++){
    
      ops.push(<TouchableOpacity key={opers[i]} style={styles.btn} onPress={() => this.operator(opers[i])}>
        <Text style={[styles.btntext, styles.white]}>{opers[i]}</Text>
     </TouchableOpacity>)
    }

    var rows =[];
    var nums =[[1,2,3],[4,5,6],[7,8,9],['.',0,'='], ['sin(','cos(','tan('], ['log(', 'deg', 'π']];
    for(let i=0; i<nums.length;i++){
      var row =[];
      for(let j=0; j<3 ;j++){
        if (nums[i][j] == "deg") {
          row.push(<TouchableOpacity key={nums[i][j]} style={styles.btn} onPress={() => this.btnPress(this.state.degRad)}>
                    <Text  style={styles.btntext}>{this.state.degRad}</Text>
                 </TouchableOpacity>);
        }
        else {
        row.push(<TouchableOpacity key={nums[i][j]} style={styles.btn} onPress={() => this.btnPress(nums[i][j])}>
                    <Text  style={styles.btntext}>{nums[i][j]}</Text>
                 </TouchableOpacity>);
        }
      }
      rows.push(<View key ={i} style={styles.row}>{row}</View>);
    }


    return (
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{this.state.inputText}</Text>
        </View>
        <View style={styles.outputBox}>
          <Text style={styles.outputText}>{this.state.outputText}</Text>
        </View>
        <View style={styles.buttons}>
          <View style={styles.operations}>
            {ops}
          </View>
          <View style={styles.numbers}>
            {rows}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#694206',
    },
    row: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    btntext: {
      fontSize: 30,

    },
    outputText: {
      fontSize: 24,
      color: 'white',
    },
    inputText: {
      fontSize: 30,
      color: 'white',
    },
    white: {
      color: 'white'
    },
    btn: {
      flex: 1,
      alignItems: 'center',
      alignSelf: 'stretch',
      justifyContent: 'center',
      borderRadius: 50,
    },
    inputBox: {
      flex: 2,
      backgroundColor: '#420420',
      justifyContent: 'center',
      alignItems: 'flex-end',
      borderRadius: 25,
    },
    outputBox: {
      flex: 2,
      backgroundColor: '#696969',
      justifyContent: 'center',
      alignItems: 'flex-end',
      borderRadius: 25,
    },
    buttons: {
      flex: 5,
      flexDirection: 'row'
    },
    numbers: {
      flex: 6,
      backgroundColor: '#666420',
      borderRadius:100,
    },
    operations: {
      flex: 2,
      justifyContent: 'space-around',
      alignItems: 'stretch',
      backgroundColor: '#420666',
      borderRadius: 150,
    }
});
