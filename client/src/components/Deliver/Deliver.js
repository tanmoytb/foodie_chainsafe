import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { searchAreaOrder, getOrder, getItem } from "../../code/functions";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    margin: "15px 0px"
  },
  cardDelivery: {
    margin: "15px 0px",
    border: "1px solid",
    borderColor: theme.palette.primary.main
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    fontSize: 14,
    color: theme.palette.writing.main
  },
}));

export default function NativeSelects(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    area: '',
  });


  const [orders, setOrders] = React.useState([]);

  const handleChange = name => async event => {
    let temp = event.target.value;
    setState({
      ...state,
      [name]: temp,
    });
    console.log(temp);
    let orders = await searchAreaOrder(parseInt(temp));
    let allOrders = [];
    for(let j=0; j<orders[0].length; j++) {
      console.log("h-1");

      let orderItem = await getOrder(parseInt(orders[0][j]));
      console.log(orderItem);
      let itemNames = [];
      console.log("h0")

      for (let i = 0; i < orderItem.items.length; i++) {
        let myItem = await getItem(parseInt(orderItem.restaurantId), parseInt(orderItem.items[i]));
        itemNames.push({
          name: myItem.name,
          price: parseInt(myItem.price),
          count: parseInt(orderItem.quantities[i])
        });
      }
      console.log("h1")
      let total = 0;
      itemNames.forEach(item => { total += item.price * item.count });
      console.log("h2")

      let myOrder2 = {
        id: parseInt(orders[0][j]),
        fullAddress: orderItem.fullAddress,
        amount: total,
      }
      console.log("h3")

      allOrders.push(myOrder2);
      console.log("h4")

    }
    console.log(allOrders);
    setOrders([...allOrders]);
  }



  const [deliveries, setDeliveries] = React.useState([]);

  const addToDeliveries = (i) => {
    let deliveriesCopy = deliveries;
    let orderCopy = orders[i];
    orderCopy.name = "Tanmoy";
    orderCopy.restaurant = "Matt cover";
    orderCopy.phone = "+xxx xxx xx";
    orderCopy.res_approval = false;
    orderCopy.area = "Bangalore";
    deliveriesCopy.push(orderCopy);
    setDeliveries([...deliveriesCopy]);
  }

  React.useEffect(() => {
    // addToDeliveries(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div>
      <div>
        {deliveries.length ?
          <div style={{ margin: "30px 0px" }}>
            <Typography variant="h5" style={{ fontWeight: "bold", margin: "30px 0px" }}>
              My current deliveries
            </Typography>
            {deliveries.map((delivery, i) => (
              <Card key={i} className={classes.cardDelivery}>
                <CardContent>
                  <div style={{ display: "flex" }}>
                    <div>
                      <Typography variant="h6">{delivery.name}</Typography>
                      <Typography variant="body2">{delivery.fullAddress}</Typography>
                      <Typography variant="body2">{delivery.phone}</Typography>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div>
                      <Typography variant="h6">{"$ " + delivery.amount}</Typography>
                      <Typography variant="body2">{delivery.area}</Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            }
          </div>
          : null
        }
      </div>
      <div style={{ display: "flex", flex: 1, marginBottom: 40 }}>
        <div style={{ marginTop: 25 }}>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            Deliver food
          </Typography>
          <Typography variant="body1" style={{ fontStyle: "italic" }}>
            while on the way
          </Typography>
        </div>
        <div style={{ flex: 1 }} />
        <FormControl className={classes.formControl}>
          <FormHelperText>Area to deliver in</FormHelperText>
          <NativeSelect
            className={classes.selectEmpty}
            value={state.area}
            name="area"
            onChange={handleChange('area')}
            inputProps={{ 'aria-label': 'area' }}
          >
            <option value="" disabled>Select an area</option>
            {props.areas.map((area, i) => (
              <option key={i} value={i}>{area}</option>
            ))}
          </NativeSelect>
        </FormControl>
      </div>
      {
        orders.length ?
          orders.map((order, i) => (
            <Card key={i} className={classes.card}>
              <CardContent style={{ padding: 12 }}>
                <div style={{ display: "flex" }}>
                  <Typography variant="h6" component="h2">{order.fullAddress}</Typography>
                  <div style={{ flex: 1 }} />
                  <Typography variant="h6" component="h2">{"$ " + order.amount}</Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <Typography className={classes.title}>{state.area}</Typography>
                  <div style={{ flex: 1 }} />
                  <Button color="primary" size="small"
                    onClick={(e) => {
                      if (window.confirm("Are you sure you want to take this delivery?")) addToDeliveries(i)
                    }}
                  >Accept delivery</Button>
                </div>
              </CardContent>
            </Card>
          ))
          : !state.area ? <Typography variant="body2" className={classes.writing}>
            Select area to show restaurants.
            </Typography> :
            <Typography variant="body2" className={classes.writing}>
              No restaurants in this area.
            </Typography>
      }
    </div>
  );
}