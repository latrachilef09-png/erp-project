// inside your e2e test setup
it('should login with valid credentials', () => {
  return request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: 'admin@test.com', password: '12345678' })
    .expect(200)
    .expect((res) => {
      expect(res.body.access_token).toBeDefined();
    });
});

it('should fail with invalid credentials', () => {
  return request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: 'admin@test.com', password: 'wrong' })
    .expect(401);
});