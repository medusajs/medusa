for d in ./packages/*/ ; 
do 
  echo $d ; 
  npm install --prefix $d ;
done
