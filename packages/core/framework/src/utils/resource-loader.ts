// ...

const isWorkflowFile = (file: string) => {
-  const fileName = path.basename(file);
-  if (fileName === 'index.js' || fileName === 'index.ts') {
-    return false;
-  }
  return file.endsWith('.workflow.js') || file.endsWith('.workflow.ts');
};

// ...