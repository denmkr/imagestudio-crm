import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class PartiesService {
  constructor(private http: Http) {}

  createNewParty(email: string, password: string) {

    const party = {
      email: email,
      password: password
    };

    /*
    this.http.post('http://jsonplaceholder.typicode.com/posts', party)
      .subscribe(
        res => { console.log(res) },
        err => { console.log("Error occured") }
      );
    */
    
    console.log("sent");
  }

  getAllParties() {
  	return this.http.get("https://randomuser.me/api/?inc=name,picture,location&results=8&nat=gb")
  	.map(response => response.json())
  	.map(response => response.results)
  	.map(users => {
  		return users.map(user => {
  			return {
  				name: user.name.first,
          lastname: user.name.last,
          street: user.location.street,
          city: user.location.city,
          state: user.location.state,
          postcode: user.location.postcode
  			}
  		})
  	})
  }

  getPartnersParties() {
    return this.http.get("https://randomuser.me/api/?inc=name,picture,location&results=8&nat=gb")
    .map(response => response.json())
    .map(response => response.results)
    .map(users => {
      return users.map(user => {
        return {
          name: user.name.first,
          lastname: user.name.last,
          street: user.location.street,
          city: user.location.city,
          state: user.location.state,
          postcode: user.location.postcode
        }
      })
    })
  }

  getClientsParties() {
    return this.http.get("https://randomuser.me/api/?inc=name,picture,location&results=8&nat=gb")
    .map(response => response.json())
    .map(response => response.results)
    .map(users => {
      return users.map(user => {
        return {
          name: user.name.first,
          lastname: user.name.last,
          street: user.location.street,
          city: user.location.city,
          state: user.location.state,
          postcode: user.location.postcode
        }
      })
    })
  }

}