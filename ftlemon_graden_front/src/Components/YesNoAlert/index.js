import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export const showConfirmation = (question) => {
    return new Promise((resolve) => {
      confirmAlert({
        title: 'Are you sure?',
        message: question,
        buttons: [
          {
            label: 'Yes',
            onClick: () => resolve(true),
          },
          {
            label: 'No',
            onClick: () => resolve(false),
          },
        ],
      });
    });
  };

