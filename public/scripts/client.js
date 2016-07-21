var app = angular.module('patronusAssignerApp', []);

app.controller('PatronusAssignerController', function($http) {
  var vm = this;

  vm.people = [];
  vm.patronus = [];
  vm.toggle = false;
  vm.testButton = testButton;

  vm.showList = function(){
    if(vm.toggle){
      vm.toggle = false;
    }else{
      vm.toggle = true;
    }
  }

  // var configPerson = {
  //   method: 'GET',
  //   url: '/person/get'
  // }

  var configPatronus = {
    method: 'GET',
    url: '/patronus/get'
  }

  function handlePersonSuccess(response) {
    vm.unassignedPeople = [];
    vm.assignedPeople = [];
    vm.people = response.data;
    console.log(vm.people);
    for (var i = 0; i < vm.people.length; i++) {
      if(vm.people[i].first_name != null){
        if(vm.people[i].patronus_id === null){
          vm.unassignedPeople.push(vm.people[i]);
        }else{
          vm.assignedPeople.push(vm.people[i]);
        }
      }

    }
    console.log(vm.unassignedPeople);
    console.log(vm.assignedPeople);
    join();
  }

  function handlePatronusSuccess(response) {
    vm.patronus = response.data;
    console.log(vm.patronus);
    console.log('Success regarding patronusList', response);
    join();
  }

  function handleFailure(response) {
    console.log('Failure!', response);
  }

  function getPeople() {
    $http.get('/person').then(handlePersonSuccess, handleFailure);
  }

  function getPatronus() {
    $http(configPatronus).then(handlePatronusSuccess, handleFailure);
  }

  vm.addPerson = function() {
    var person = vm.newPerson.split(' ');
    var data = {first_name: person[0], last_name: person[1]};
    console.log(data);
    $http.post('/person', data).then(function(response) {
      console.log(response);
      getPeople();
    }, function(response) {
      console.log(response);
    })
  };

  vm.addPatronus = function() {
    var data = {patronus: vm.newPatronus};
    console.log(data);
    $http.post('/patronus/add', data).then(function(response) {
      console.log(response);
      getPatronus();
    }, function(response) {
      console.log(response);
    })
  };

  function join(){
    $http.get('/join').then(handleJoinSuccess, handleFailure);
  }

  function handleJoinSuccess(response){
    vm.unassignedPatronuses = [];
    vm.assignedPatronuses = [];
    vm.joinList = response.data;
    console.log('joined table ', vm.joinList);
    for (var i = 0; i < vm.joinList.length; i++) {
      if(vm.joinList[i].patronus_name != null){
        if(vm.joinList[i].patronus_id === null){
          vm.unassignedPatronuses.push(vm.joinList[i]);
        }else{
          vm.assignedPatronuses.push(vm.joinList[i]);
        }

      }
    }
    console.log('Unassigned Patronuses: ', vm.unassignedPatronuses);
    console.log('Assigned Patronuses: ', vm.assignedPatronuses);
  }

  function testButton(){
    var data = {personId: vm.unassignedPerson.id, patronusId: vm.unassignedPatronus.id}
    $http.post('/assign', data).then(function(response) {
      console.log(response);
      getPeople();
      getPatronus();
    }, function(response){
      console.log(response);
    })
  }

  getPeople();
  getPatronus();
  // join();
});
