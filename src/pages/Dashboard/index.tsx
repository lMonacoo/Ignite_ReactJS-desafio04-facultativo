import { useEffect, useState } from 'react';

import api from '../../services/api';

import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface Foods {
  avaliable: boolean;
  description: string;
  id: number;
  image: string;
  name: string;
  price: string;
}

export const Dashboard = (): JSX.Element => {
  const [foods, setFoods] = useState<Foods[]>([]);
  const [editingFood, setEditingFood] = useState({id:0});
  const [modalOpen, setModalopen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      const data = await api.get('/foods').then(response => response.data);
      setFoods(data);
    };

    getData();
  }, []);

  const handleAddFood = async (food: Foods) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: Foods) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, { ...editingFood, ...food });

      const foodsUpdated = foods.map<Foods>(f => (f.id !== foodUpdated.data.id ? f : foodUpdated.data));

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModalopen(prev => !prev);
  };

  const toggleEditModal = () => {
    setEditModalOpen(prev => !prev);
  };

  const handleEditFood = (food: Foods) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood isOpen={modalOpen} setIsOpen={toggleModal} handleAddFood={handleAddFood} />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid='foods-list'>
        {foods &&
          foods.map(food => (
            <Food key={food.id} food={food} handleDelete={handleDeleteFood} handleEditFood={handleEditFood} />
          ))}
      </FoodsContainer>
    </>
  );
};
