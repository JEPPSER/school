#ifndef MAPITEM_H
#define MAPITEM_H

#include <QGraphicsItem>
#include <QPainter>

class MapItem : public QGraphicsObject
{
public:
    MapItem(QGraphicsItem *parent = nullptr);
    MapItem(qreal x, qreal y, int size, QGraphicsItem *parent = nullptr);

    void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget = nullptr) override;
    QRectF boundingRect() const override;

    QString id;
    QString name;
    qreal temp;
    qreal elevation;
    qreal latitude;
    qreal longitude;

    QColor color = Qt::blue;
    bool hover = false;

private:
    QPolygonF shape;
};

#endif // MAPITEM_H
