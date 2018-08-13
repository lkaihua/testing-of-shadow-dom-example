# wdio-shadow-dom-example
How to test a Shadow DOM based web app with Webdriver IO.

## About

This demo demonstrates how to set up a test against a minimum Shadow DOM based web app (Polymer 2.0 as an example) by extending webdriver IO native APIs.

## Pain Point

The traditional approach of `browser.getElementById('#submit')` is not able to retrieve an element by id if such element locates inside a Shadow DOM. Since Shadow DOM aims to create a standalone 'sandbox' to provide encapsulation, it is legal to have multiple elements of the same `ID` within multiple instances of one component, so the traditional approach is not feasible here.

Until August 2018 the test for Shadow DOM is not officially supported by Webdriver IO. 

## Technology stack

### Webdriver IO

> It basically sends requests to a Selenium server via the WebDriver Protocol and handles its response. These| requests are wrapped in useful commands and can be used to test several aspects of your site in an automated way.

### Selenium

### Cucumber

### 


## Steps

1. 
  
