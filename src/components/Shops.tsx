import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { useSelector, RootStateOrAny } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  ListItemIcon,
  ListItemSecondaryAction,
  OutlinedInput,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { Shop } from '@src/models/Shop';
import { Item } from '@src/models/Item';
import { useAppDispatch } from '@src/stores/index';
import { fetchItems, fetchShops, createItem, updateItem, deleteItem } from '@src/stores/shops';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    list: {
      backgroundColor: theme.palette.background.paper,
      minHeight: 200,
    },
    form: {
      paddingTop: 30,
    },
    formControl: {
      margin: 8,
    },
  }),
);

const Shops: React.FC = () => {
  const classes = useStyles();
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [inputElement, setInputElement] = useState<HTMLInputElement>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File>();

  const shops = useSelector((state: RootStateOrAny) => state.shops.shops);
  const items = useSelector((state: RootStateOrAny) => state.shops.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchShops());
  }, []);
  useEffect(() => {
    setName(selectedItem?.name || '');
    setDescription(selectedItem?.description || '');
    setFile(undefined);
    if (inputElement) {
      inputElement.value = '';
    }
  }, [selectedItem]);

  const handleShopClick = useCallback(
    (shopId: string) => {
      setSelectedShopId(shopId);
      setSelectedItem(undefined);
      dispatch(fetchItems(shopId));
    },
    [dispatch],
  );
  const handleItemClick = (item: Item | undefined) => {
    setSelectedItem(item);
  };
  const handleItemDelete = useCallback(
    (item: Item) => {
      dispatch(deleteItem(item));
    },
    [dispatch],
  );

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      setFile(file);
    }
  };
  const handleSubmit = useCallback(async () => {
    if (!selectedItem) {
      if (!file) {
        return;
      }
      const item = await dispatch(createItem({ item: { name, description }, file })).then(
        unwrapResult,
      );
      setSelectedItem(item);
    } else {
      dispatch(updateItem({ name, description }));
    }
  }, [dispatch, name, description, file]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography variant="h6">Shops</Typography>
          <List component="nav" className={classes.list}>
            {shops.map((shop: Shop) => {
              return (
                <ListItem
                  key={shop.id}
                  button
                  selected={selectedShopId === shop.id}
                  onClick={(_) => handleShopClick(shop.id)}
                >
                  <ListItemText primary={shop.name} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h6">Items</Typography>
          <List component="nav" className={classes.list}>
            {items.map((item: Item) => {
              return (
                <ListItem
                  key={item.id}
                  button
                  selected={selectedItem?.id === item.id}
                  onClick={(_) => handleItemClick(item)}
                >
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(_) => handleItemDelete(item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
            {selectedShopId ? (
              <ListItem
                key="new-item"
                button
                selected={!selectedItem}
                onClick={(_) => handleItemClick(undefined)}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="New item" />
              </ListItem>
            ) : (
              ''
            )}
          </List>
        </Grid>
        <Grid item xs={12}>
          <form noValidate autoComplete="off" className={classes.form}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel htmlFor="item-name">Name</InputLabel>
              <Input id="item-name" value={name} onChange={handleNameChange} />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel htmlFor="item-description">Description</InputLabel>
              <Input id="item-description" value={description} onChange={handleDescriptionChange} />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <Typography variant="h6">File</Typography>
              <OutlinedInput
                id="item-file"
                type="file"
                disabled={!!selectedItem}
                onChange={handleFileChange}
                inputRef={(el) => setInputElement(el)}
              />
            </FormControl>
            <Grid container justify="flex-end">
              <FormControl className={classes.formControl}>
                <Button
                  disabled={!name || (!selectedItem && !file)}
                  onClick={handleSubmit}
                  variant="outlined"
                  size="large"
                >
                  Submit
                </Button>
              </FormControl>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default Shops;
