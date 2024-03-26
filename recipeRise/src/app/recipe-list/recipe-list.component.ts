import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    
  }
  


  recipes  =[
    { id: 1, name: "Pasta Bolognese", cookingTime: 200, imageUrl: "bolognese.jpeg", description: "Savor the deliciousness of this tasty recipe that promises to delight your taste buds with every bite", cuisineType: "Italian"},
    { id: 2, name: "Cheese Burger", cookingTime: 300, imageUrl: "cheeseBurger.jpg", description: "Savor the deliciousness of this tasty recipe that promises to delight your taste buds with every bite", cuisineType: "American"},
    { id: 3, name: "Pizza", cookingTime: 400, imageUrl: "pizza.png", description: "Savor the deliciousness of this tasty recipe that promises to delight your taste buds with every bite", cuisineType: "Italian" },
    {id: 4, name: "Ramen", cookingTime: 400, imageUrl: "ramen.png", description: "Savor the deliciousness of this tasty recipe that promises to delight your taste buds with every bite", cuisineType: "Chinese"},
    
  ]
 
}
