import React from 'react'
import styles from './Alert.module.css';
import cn from 'classnames';
import { motion } from "framer-motion"

function Alert({kind, children}) {
  return (
   
    <motion.div 
        className={cn(styles.alert, 
            {
                [styles.normal]: kind === 'normal',
                [styles.error]: kind === 'error'
            })}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0}}
        transition={{
            type: "spring",
        }}
    >
        {children}
    </motion.div>
  );
}

export default Alert;