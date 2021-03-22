import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LETTERS, NUMBER_LETTERS } from './data/letters';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public letters: { [key:string]: number  } = { ...LETTERS }; // A copy of the letters object
  public originalLetters = { ...LETTERS };
  public originalNumberLetters = { ...NUMBER_LETTERS };
  
  // Input fields
  public decryptedMessage: string = '';
  public encryptedMessage = this.fb.control( 'VTGTWT' );
  public shiftKey = this.fb.control(0, [ 
    Validators.required, 
    Validators.min(0),
    Validators.max(25),
  ]);
  
  constructor( private fb: FormBuilder ) {

  }

  // Listen shiftKey value changes
  ngOnInit() {
    this.shiftKey.valueChanges.subscribe( value => {
      
      if( this.shiftKey.invalid ) return;
      this.shiftLetterValues( value );

      // Decrypt message using the new ShiftKey
      this.decryptMessage( value );

    });

  }
  
  shiftLetterValues( shift: number ) {

    Object.keys( LETTERS ).forEach( (l) => {
      this.letters[l] = ( LETTERS[l] + shift) > 26
                          ? ( LETTERS[l] + shift) % 26
                          :   LETTERS[l] + shift 
    })
  }

  decryptMessage( shift: number ) {

    // Cut the letters into an array
    const letters: string[] = this.encryptedMessage.value.split('');

    // Get the original letter number
    const letterNumbers: number[] = letters.map( l => this.originalLetters[l] );
    
    // get the value bases on the shift
    const decriptedLetterNumbers = letterNumbers.map( number => {
      const X = ( number - shift ) % 26;
      return ( X < 0 ) 
              ? 26 + X
              : X;
    });

    // Get the letter fron the decripter letter number
    const decryptedLetters = decriptedLetterNumbers.map( letterNum => this.originalNumberLetters[letterNum] )

    // console.log(letters);
    // console.log(letterNumbers);
    // console.log(decriptedLetterNumbers);
    // console.log(decryptedLetters);
    this.decryptedMessage = decryptedLetters.join('');
  }

}
