var app = angular.module('Contabilidad', ['ngAnimate', 'ui.bootstrap']);
app.controller('conta', function($scope) {

  //infoClass sirve para cambiar de color al saldo total
  $scope.infoClass = function() {
      if($scope.saldoActual<0){
        $scope.iClass = "infoRed";
      } else if ($scope.saldoActual< 10000) {
        $scope.iClass = "infoOrange";
      } else {
        $scope.iClass = "infoGreen";
      }
  }

//observa si ha habido algun cambio en el saldo Total para volver a evaluar su clase
  $scope.$watch("saldoActual", function(newValue, oldValue) {
    $scope.infoClass();
  })

//ingresos
  $scope.categoriaIngresos = ["Ventas", "Comisiones", "Inversiones"];

  //nuevo ingreso sirve como modelo para el "formulario" del modal agregar nuevo ingreso
  $scope.nuevoIngreso = {
    categoria: $scope.categoriaIngresos[0],
    fecha: "",
    cantidad: 100
  };

  //Arreglo de objetos scope.ingresos actua como la base de datos
  $scope.ingresos = [{
    categoria: "Ventas",
    fecha: "2018-09-10T06:00:00.000Z",
    cantidad: 50000
  },
  {
    categoria: "Comisiones",
    fecha: "2018-09-10T06:00:00.000Z",
    cantidad: 3500
  },
  {
    categoria: "Inversiones",
    fecha: "2018-09-10T06:00:00.000Z",
    cantidad: 150000
  }];

  //anade un nuevo objeto a scope.ingresos
  $scope.agregarIngreso = function() {
    $scope.ingresos.push(angular.copy($scope.nuevoIngreso));
  };
  //suma de cantidades
  $scope.sumaIngresos = function() {
    var suma = 0;
    if ($scope.ingresos.length) {
      var i = $scope.ingresos.length;
      while (i > 0) {
        i--;
        suma += $scope.ingresos[i].cantidad;
      }
    }
    return suma;
  };

  //observa si se ha modificado scope.ingresos para volver a calcular el Saldo total
  $scope.$watchCollection("ingresos", function(newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }
    $scope.saldoActual = $scope.sumaIngresos() - $scope.sumaEgresos();
  });

  $scope.borrarIngreso = function(idx) {
    $scope.ingresos.splice(idx, 1);
  };

  $scope.categoriaEgresos = ["Sueldos", "Compras", "Servicios", "Imprevistos"];
  $scope.nuevoEgreso = {
    categoria: $scope.categoriaEgresos[0],
    fecha: "",
    cantidad: 0
  };
  $scope.egresos = [{
    categoria: "Sueldos",
    fecha: "2018-09-10T06:00:00.000Z",
    cantidad: 2000
  },
  {
    categoria: "Compras",
    fecha: "2018-09-10T06:00:00.000Z",
    cantidad: 34000
  },
  {
    categoria: "Servicios",
    fecha: "2018-09-10T06:00:00.000Z",
    cantidad: 10000
  }];
  //scope.egresos actua como la base de datos

  $scope.agregarEgreso = function() {
    $scope.egresos.push(angular.copy($scope.nuevoEgreso));
  };
  $scope.sumaEgresos = function() {
    var suma = 0;
    if ($scope.egresos.length) {
      var i = $scope.egresos.length;
      while (i > 0) {
        i--;
        suma += $scope.egresos[i].cantidad;
      }
    }
    return suma;
  };
  $scope.$watchCollection("egresos", function(newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }
    $scope.saldoActual = $scope.sumaIngresos() - $scope.sumaEgresos();
  });

  $scope.borrarEgreso = function(idx) {
    $scope.egresos.splice(idx, 1);
  };

  $scope.saldoActual = $scope.sumaIngresos() - $scope.sumaEgresos();
  $(document).ready(function() {
    $('[title="Agrega un nuevo Ingreso"]').tooltip({
      trigger: 'hover'
    });
    $('[title="Agrega un nuevo Egreso"]').tooltip({
      trigger: 'hover'
    });
  });

//funcion para crear grafica de ingresos
  $scope.ingChart = function(){
    var cantidades = [], i = $scope.categoriaIngresos.length, j = $scope.ingresos.length;
    while (i >0) {
      i --;
      cantidades.push(0);
    }

    while (j > 0) {
      j--;
      i = $scope.categoriaIngresos.length;
      while(i>0){
        i--;
        if($scope.ingresos[j].categoria == $scope.categoriaIngresos[i]){
          cantidades[i] += $scope.ingresos[j].cantidad;
          break;
        }
      }
    }

    var myChart = Highcharts.chart('container', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Ingresos'
      },
      xAxis: {
        categories: $scope.categoriaIngresos
      },
      yAxis: {
        title: {
          text: 'Cantidad en Pesos'
        }
      },
      series: [{
        name: "Ingresos",
        color: "green",
        data: cantidades
      }]
    });
  };

//funcion para crear grafica de egresos
  $scope.egrChart = function(){
    var cantidades = [], i = $scope.categoriaEgresos.length, j = $scope.egresos.length;
    while (i >0) {
      i --;
      cantidades.push(0);
    }

    while (j > 0) {
      j--;
      i = $scope.categoriaEgresos.length;
      while(i>0){
        i--;
        if($scope.egresos[j].categoria == $scope.categoriaEgresos[i]){
          cantidades[i] += $scope.egresos[j].cantidad;
          break;
        }
      }
    }

    var myChart = Highcharts.chart('container2', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Egresos'
      },
      xAxis: {
        categories: $scope.categoriaEgresos
      },
      yAxis: {
        title: {
          text: 'Cantidad en Pesos'
        }
      },
      series: [{
        name: "Egresos",
        color: "red",
        data: cantidades
      }]
    });
  };

  $scope.chart = function() {
    $scope.ingChart();
    $scope.egrChart();
  };
});
