#include "mapitem.h"

MapItem::MapItem(QGraphicsItem *parent) : QGraphicsObject(parent)
{
}

MapItem::MapItem(qreal x, qreal y, QGraphicsItem *parent)
    : QGraphicsObject(parent)
{
    shape << QPointF(x, y) << QPointF(x + 10, y) << QPointF(x + 10, y + 10) << QPointF(x, y + 10);
}

QRectF MapItem::boundingRect() const
{
    return shape.boundingRect();
}

void MapItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    Q_UNUSED(option);
    Q_UNUSED(widget);

    painter->setBrush(color);
    painter->drawPolygon(shape, Qt::OddEvenFill);
}
