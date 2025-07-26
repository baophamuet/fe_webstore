import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function Dashboard() {
  return (
    <>
            <Row className="mb-4">
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <h6>New Orders</h6>
                    <h4>6,267</h4>
                    <small>For this week</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <h6>Revenue</h6>
                    <h4>$180,900</h4>
                    <small>For this month</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <h6>Page Views</h6>
                    <h4>28,210</h4>
                    <small>For this month</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card>
                  <Card.Body>
                    <h6>Support Request</h6>
                    <h4>75</h4>
                    <small>For this week</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
    
            <Row>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Traffic Overview</Card.Title>
                    <div style={{ height: "200px", backgroundColor: "#e6f0ff" }}>
                      {/* Bạn có thể chèn biểu đồ ở đây sau */}
                      (Chart placeholder)
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Sales Overview</Card.Title>
                    <div style={{ height: "200px", backgroundColor: "#e6ffe6" }}>
                      (Chart placeholder)
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
    </>
  )
}
