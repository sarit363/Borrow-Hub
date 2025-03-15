 const equipments = [
    {
      name: 'מחשב נייד',
      description: 'מחשב נייד לחוויית עבודה ניידת',
      category: 'אלקטרוניקה',
      status: 'זמין',
      image: 'https://example.com/laptop.jpg',
    },
    {
      name: 'מצלמה',
      description: 'מצלמת DSLR מקצועית',
      category: 'צילום',
      status: 'מושאל',
      image: 'https://example.com/camera.jpg',
    },
    {
      name: 'עכבר',
      description: 'עכבר אופטי מקצועי',
      category: 'הנדסה',
      status: 'זמין',
      image: 'https://example.com/mouse.jpg',
    },
  ];
  
  // app.get('/equipments', (req: Request, res: Response) => {
  //   res.send(equipments);
  // });
  export default equipments;